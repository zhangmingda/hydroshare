import json

from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponse

from hs_core import hydroshare
from hs_core.views import _set_resource_sharing_status
from hs_core.views.utils import authorize
from hs_core.hydroshare.utils import user_from_id, resource_modified

def update_collection(request, shortkey, *args, **kwargs):
    try:
        collection_res_obj, is_authorized, user = authorize(request, shortkey, edit=True, full=True, superuser=True, raises_exception=True)
        if is_authorized:

            collection_content_res_id_list = []
            for res_id in request.POST.getlist("collection_items"):
                collection_content_res_id_list.append(res_id)

            if collection_res_obj.metadata.collection_items.first() is not None:
                element_id = collection_res_obj.metadata.collection_items.first().id
                hydroshare.resource.update_metadata_element(collection_res_obj.short_id, 'CollectionItems',
                collection_items=collection_content_res_id_list, element_id=element_id)
            else:
                hydroshare.resource.create_metadata_element(collection_res_obj.short_id,
                'CollectionItems', collection_items=collection_content_res_id_list)

            current_sharing_status = "Private"
            if collection_res_obj.raccess.discoverable:
                current_sharing_status = "Discoverable"
            elif collection_res_obj.raccess.public:
                current_sharing_status = "Public"

            new_sharing_status = ""
            if collection_res_obj.raccess.public or collection_res_obj.raccess.discoverable:
                for checked_res_id in collection_content_res_id_list:
                    res_checked = hydroshare.get_resource_by_shortkey(checked_res_id)
                    if not res_checked.raccess.public and not res_checked.raccess.discoverable:
                        _set_resource_sharing_status(request, user, collection_res_obj, flag_to_set='public', flag_value=False)
                        new_sharing_status = "Private"

            user_permission = "Edit"
            _, is_owner, _ = authorize(request, shortkey, full=True, superuser=True, raises_exception=False)
            if is_owner:
                user_permission = "Own"

            if collection_res_obj.metadata.has_all_required_elements():
                metadata_status = "Sufficient to make public"
            else:
                metadata_status = "Insufficient to make public"

            resource_modified(collection_res_obj, user)
            ajax_response_data = {'status': 'success', 'user_permission': user_permission, \
                                  'current_sharing_status': current_sharing_status, \
                                  'new_sharing_status': new_sharing_status, 'metadata_status': metadata_status}
            return HttpResponse(json.dumps(ajax_response_data))

    except Exception as ex:
        ajax_response_data = {'status': 'error', 'message': ex.message}
        return HttpResponse(json.dumps(ajax_response_data))


def collection_member_permission(request, shortkey, user_id, *args, **kwargs):
    try:
        collection_res_obj, is_authorized, user = authorize(request, shortkey, view=True, edit=True, \
                                                  full=True, superuser=True, raises_exception=True)
        no_permission_list = []
        if is_authorized:
            user_to_share_with = user_from_id(user_id)
            if collection_res_obj.metadata.collection_items.first() is not None:
                for res_in_collection in collection_res_obj.metadata.collection_items.first().collection_items.all():
                    if not user_to_share_with.uaccess.can_view_resource(res_in_collection) \
                       and not res_in_collection.raccess.public and not res_in_collection.raccess.discoverable:
                        no_permission_list.append(res_in_collection.short_id)
                status = "success"
                ajax_response_data = {'status': status, 'no_permission_list': no_permission_list}
                return HttpResponse(json.dumps(ajax_response_data))
            else:
                raise Exception("Collection member metadata is not yet initialized.")
    except Exception as ex:
        ajax_response_data = {'status': "error", 'message': ex.message}
        return HttpResponse(json.dumps(ajax_response_data))