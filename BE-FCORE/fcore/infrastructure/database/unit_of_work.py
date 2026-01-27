from sqlalchemy.orm import Session
from ...application.interfaces.i_unit_of_work import IUnitOfWork
from ...infrastructure.database.repositories.sqlalchemy_analyst_repository import SqlAlchemyAnalystRepository
from ...infrastructure.database.repositories.sqlalchemy_role_repository import SqlAlchemyRoleRepository

class SqlAlchemyUnitOfWork(IUnitOfWork):


    def __init__(self, session_factory):

        self._session_factory = session_factory
        self._session: Session = None

    def __enter__(self):
        self._session = self._session_factory()
        self.analyst_repository = SqlAlchemyAnalystRepository(self._session)
        self.role_repository = SqlAlchemyRoleRepository(self._session)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type:
                self.rollback()
            else:
                self._session.close()
        except Exception:
            self.rollback()
            raise
        finally:
            self._session.close()

    def commit(self):
        self._session.commit()

    def rollback(self):
        self._session.rollback()