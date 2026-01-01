"use client";
import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/app/utils/cropImage";
import { API } from "@/app/utils/api";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dbqirapyz/image/upload/v1766351294/avatar_zrjmys.png";

const EditAvatarModal = ({ currentAvatar, onClose, onSave }) => {
  const fileInputRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [preview, setPreview] = useState(currentAvatar);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCancelCrop = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSave = async () => {
    if (!imageSrc) {
      onClose();
      return;
    }

    try {
      setSaving(true);

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append("avatar", croppedBlob, "avatar.png");

      const res = await axios.patch(`${API}/me`, formData, {
        withCredentials: true,
      });

      toast.success("Avatar updated successfully!");
      setPreview(res.data.user.avatar);
      onSave(res.data.user.avatar);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setSaving(true);

      const res = await axios.patch(
        `${API}/me`,
        { avatar: DEFAULT_AVATAR },
        { withCredentials: true }
      );

      toast.success("Avatar removed!");
      setPreview(DEFAULT_AVATAR);
      onSave(DEFAULT_AVATAR);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white px-5 pt-5 rounded-xl w-full max-w-sm space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Update Avatar</h3>
          <img
            src="/images/settings/close.png"
            className="w-4.5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex justify-center">
          {imageSrc ? (
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <img
              src={preview}
              className="w-36 h-36 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center gap-8 text-sm mt-8">
          {!imageSrc ? (
            <>
              <button
                onClick={handleRemoveAvatar}
                className="w-24 py-1.5 border rounded-md cursor-pointer"
              >
                Remove
              </button>
              <button
                onClick={handleFileClick}
                className="w-24 py-1.5 text-white font-medium bg-[#166831] rounded-md cursor-pointer"
              >
                Change
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancelCrop}
                className="w-24 py-1.5 border rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-24 py-1.5 bg-[#166831] text-white rounded-md flex items-center justify-center cursor-pointer"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default EditAvatarModal;
