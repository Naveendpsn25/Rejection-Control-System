from django.urls import path

from .views import (
    RejectionEntryListCreateAPIView,
    RejectionEntryRetrieveUpdateDestroyAPIView,
)

from .views import (
    DepartmentListAPIView,ShiftListAPIView,PartListAPIView,OperationListAPIView ,DefectTypeListAPIView
)

urlpatterns = [

    path(
        "",
        RejectionEntryListCreateAPIView.as_view(),
        name="rejection-list-create",
    ),

    path(
        "<int:pk>/",
        RejectionEntryRetrieveUpdateDestroyAPIView.as_view(),
        name="rejection-detail",
    ),

    path(
        "departments/",
        DepartmentListAPIView.as_view(),
        name="department-list",
    ),

    path(
        "shifts/",
        ShiftListAPIView.as_view(),
        name="shift-list",
    ),

    path(
        "parts/",
        PartListAPIView.as_view(),
        name="part-list",
    ),

    path(
        "operations/",
        OperationListAPIView.as_view(),
        name="operation-list",
    ),

    path(
        "defect-types/",
        DefectTypeListAPIView.as_view(),
        name="defect-type-list",
    ),
]