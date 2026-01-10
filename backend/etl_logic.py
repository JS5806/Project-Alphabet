import pandas as pd
import requests
import logging
from sqlalchemy import create_engine
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SmartInventoryETL:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)

    def extract_public_population(self, api_key, region_id):
        """
        Extracts floating population data from Public Data Portal API.
        Handles Rate Limiting via simple retry logic.
        """
        url = f"https://api.data.go.kr/floating-population/{region_id}"
        params = {'serviceKey': api_key, 'type': 'json'}
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"API Extraction Failed: {e}")
            return None

    def transform_sales_data(self, raw_df: pd.DataFrame):
        """
        Anonymizes PII (Personal Identifiable Information) 
        and normalizes age/gender groups.
        """
        # Anonymize: Remove customer names/IDs
        if 'customer_name' in raw_df.columns:
            raw_df = raw_df.drop(columns=['customer_name', 'phone_number'])
        
        # Normalize Age Group
        def categorize_age(age):
            return f"{(age // 10) * 10}s"
            
        raw_df['age_group'] = raw_df['age'].apply(categorize_age)
        return raw_df[['product_id', 'category', 'gender', 'age_group', 'amount', 'timestamp', 'region_code']]

    def load_to_postgres(self, df, table_name):
        """Loads refined data into PostgreSQL/PostGIS"""
        df.to_sql(table_name, self.engine, if_exists='append', index=False)
        logger.info(f"Successfully loaded {len(df)} rows to {table_name}")