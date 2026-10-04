import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  const { featureImageList } = useSelector(
    (state) => state.commonFeature
  );

  console.log("uploadedImageUrl:", uploadedImageUrl);
  console.log("featureImageList:", featureImageList);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      console.log("No image uploaded yet");
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }
  function handleDeleteFeatureImage(id) {
  dispatch(deleteFeatureImage(id)).then((data) => {
    if (data?.payload?.success) {
      dispatch(getFeatureImages());
    }
  });
}

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={!uploadedImageUrl || imageLoadingState}
      >
        {imageLoadingState ? "Uploading..." : "Upload"}
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.length > 0 &&
          featureImageList.map((featureImgItem) => (
            <div
  key={featureImgItem._id}
  className="relative"
>
  {featureImgItem.image && (
    <>
      <img
        src={featureImgItem.image}
        alt="Feature"
        className="w-full h-[300px] object-cover rounded-t-lg"
      />

      <Button
        onClick={() =>
          handleDeleteFeatureImage(featureImgItem._id)
        }
        className="mt-2 w-full bg-red-500 hover:bg-red-600"
      >
        Delete
      </Button>
    </>
  )}
</div>
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;