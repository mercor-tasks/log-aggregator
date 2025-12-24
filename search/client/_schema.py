class SearchSchema:
    application: str
    start_time: int
    end_time: int
    search_terms: list[str]

    def _build_where_clause(term: str):
        return f'string_match({term})'

    def _build_query(self):
        clauses = [self._build_where_clause(term)
                   for term in self.search_terms]
        clause_str = ' and '.join(clauses)
        main_clause = f'select * from "{self.application}"'

        if len(clause_str) > 0:
            main_clause += f' where {clause_str}'

        return main_clause

    @classmethod
    def _from_json(cls, json_data: dict):
        cls.application = json_data.get('application')
        cls.search_terms = json_data.get('searchTerms')
        cls.start_time = json_data.get('startTime')
        cls.end_time = json_data.get('endTime')
        return cls
