from rest_framework.routers import DefaultRouter

from apps.approvals.views import ApprovalStepViewSet

router = DefaultRouter()
router.register("", ApprovalStepViewSet, basename="approval")

urlpatterns = router.urls
