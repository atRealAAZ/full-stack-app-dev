def db_query(
    db_model, db_col, search_term
):
    filters = {db_col: search_term}
    query = (
        db_model
        .query
        .filter_by(**filters)
        .first()
    )
    if query == None:
        return False, query
    else:
        return True, query
    
def gen_result_dict(**kwargs):
    return kwargs

def get_dict_from_object(
    sqlalchemy_obj,
    to_exclude = ['_sa_instance_state']
):
    db_dict = sqlalchemy_obj.__dict__
    new_dict = {
        key: db_dict[key]
        for key in db_dict.keys()
        if key not in to_exclude
    }
    return new_dict

def get_dicts(query):
    return [
        get_dict_from_object(obj) for obj in query
    ]