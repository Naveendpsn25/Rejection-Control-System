from django.urls import path

from .views import CAPAListAPIView,CAPACountAPIView,CAPASubmitAPIView,CAPAApprovalAPIView

urlpatterns = [
    path("", CAPAListAPIView.as_view()),
    path("count/",CAPACountAPIView.as_view(),),
    path("<int:pk>/",CAPASubmitAPIView.as_view(),name="capa-submit",),
    path("<int:pk>/approval/",CAPAApprovalAPIView.as_view(),
),
]