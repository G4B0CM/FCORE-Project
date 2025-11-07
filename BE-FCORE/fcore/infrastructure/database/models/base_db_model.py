# Add these imports at the top
import uuid
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID

# This class is the key for SQLite compatibility
class UUID_CHAR(TypeDecorator):
    """
    Stores UUIDs as CHAR(36) in SQLite, and uses native UUID for PostgreSQL.
    This allows us to develop with SQLite and deploy to Postgres without code changes.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        else:
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        else:
            try:
                return uuid.UUID(value)
            except (ValueError, TypeError):
                return None

# Your existing Base class
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()