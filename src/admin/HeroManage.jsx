import { getAdminUrl } from "@/admin/adminPaths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { isAdminLoggedIn } from "@/services/adminService";
import {
  deleteHeroBanner,
  fetchHeroBanners,
  toggleHeroBanner,
  uploadHeroBanner,
} from "@/services/heroService";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../services/adminService";
import AdminSidebar from "./AdminSidebar";

const HeroManage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [banners, setBanners] = useState([]);

  const activeCount = useMemo(
    () => banners.filter((banner) => Boolean(banner.status)).length,
    [banners],
  );

  const loadBanners = async () => {
    try {
      setLoadingList(true);
      const response = await fetchHeroBanners();
      setBanners(response.banners || []);
    } catch (error) {
      toast.error(error.message || "Failed to load hero banners");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate(getAdminUrl("login"), { replace: true });
      return;
    }
    loadBanners();
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only jpg, jpeg, png, webp files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be 2MB or less");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      setLoadingUpload(true);
      await uploadHeroBanner(selectedFile);
      toast.success("Hero banner uploaded successfully");
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      await loadBanners();
    } catch (error) {
      toast.error(error.message || "Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleHeroBanner(id);
      toast.success("Banner status updated");
      await loadBanners();
    } catch (error) {
      toast.error(error.message || "Unable to toggle banner");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHeroBanner(id);
      toast.success("Banner deleted");
      await loadBanners();
    } catch (error) {
      toast.error(error.message || "Unable to delete banner");
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="heroManage" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">Hero Banners</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload and control homepage hero banners.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    Active {activeCount} / {banners.length}
                  </Badge>
                  {loadingList ? (
                    <Badge variant="outline">Loading…</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Upload Banner</h2>
                <p className="text-sm text-muted-foreground">
                  JPG / PNG / WEBP (max 2MB).
                </p>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr,1.2fr]">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleSelectFile}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={loadingUpload || !selectedFile}
                      >
                        {loadingUpload ? "Uploading…" : "Upload"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={!selectedFile && !previewUrl}
                        onClick={() => {
                          setSelectedFile(null);
                          if (previewUrl) {
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl("");
                          }
                        }}
                      >
                        Clear
                      </Button>

                      {selectedFile ? (
                        <span className="text-xs text-muted-foreground">
                          {selectedFile.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No file selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-medium">Preview</p>
                  <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-44 sm:h-56 md:h-72 w-full object-contain bg-background"
                      />
                    ) : (
                      <div className="flex h-44 sm:h-56 md:h-72 items-center justify-center text-sm text-muted-foreground">
                        Select an image to preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Existing Banners</h2>
                <p className="text-sm text-muted-foreground">
                  Toggle active state or delete banners.
                </p>
              </div>

              {loadingList ? (
                <p className="text-sm text-muted-foreground">
                  Loading banners...
                </p>
              ) : banners.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hero banners found.
                </p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {banners.map((banner) => (
                    <div
                      key={banner.id}
                      className="rounded-xl border border-border bg-background p-3 md:p-4 flex flex-col gap-3"
                    >
                      <img
                        src={banner.imageDesktop || banner.imageUrl}
                        alt={`Hero ${banner.id}`}
                        className="h-32 sm:h-36 w-full rounded-lg object-contain bg-card"
                        loading="lazy"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={banner.status ? "default" : "outline"}>
                          {banner.status ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ID: {banner.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleToggle(banner.id)}
                        >
                          Toggle
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(banner.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroManage;
