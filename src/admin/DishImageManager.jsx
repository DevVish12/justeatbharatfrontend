import { getAdminUrl } from "@/admin/adminPaths";
import AdminSidebar from "@/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getImage } from "@/lib/imageMap";
import { isAdminLoggedIn, logoutAdmin } from "@/services/adminService";
import { apiRequest } from "@/services/api";
import { getProcessedMenu } from "@/services/menuService";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 300 * 1024;

const DishImageManager = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState({});
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState("");
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const ca = String(a.category || "").localeCompare(
        String(b.category || ""),
      );
      if (ca !== 0) return ca;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();
    if (!q) return sortedItems;

    return sortedItems.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const category = String(item?.category || "").toLowerCase();
      const id = String(item?.id || "").toLowerCase();
      return name.includes(q) || category.includes(q) || id.includes(q);
    });
  }, [sortedItems, search]);

  const totalPages = useMemo(() => {
    const total = filteredItems.length;
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [filteredItems.length]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, page]);

  const rangeLabel = useMemo(() => {
    const total = filteredItems.length;
    if (!total) return "Showing 0 of 0";
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(total, page * pageSize);
    return `Showing ${start}-${end} of ${total}`;
  }, [filteredItems.length, page]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const processed = await getProcessedMenu();
      setItems(processed.items || []);
    } catch (error) {
      toast.error(error.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate(getAdminUrl("login"), { replace: true });
      return;
    }

    loadMenu();
  }, [navigate]);

  useEffect(() => {
    return () => {
      Object.values(selected).forEach((entry) => {
        if (entry?.previewUrl) {
          URL.revokeObjectURL(entry.previewUrl);
        }
      });

      bulkFiles.forEach((entry) => {
        if (entry?.previewUrl) {
          URL.revokeObjectURL(entry.previewUrl);
        }
      });
    };
  }, [selected, bulkFiles]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate(getAdminUrl("login"), { replace: true });
  };

  const handleSelectFile = (itemId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    selectFileForItem(itemId, file);
    // Allow re-selecting the same file.
    event.target.value = "";
  };

  const selectFileForItem = (itemId, file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only jpg, jpeg, png, webp images are allowed");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be smaller than 300KB");
      return;
    }

    setSelected((prev) => {
      const prevEntry = prev[itemId];
      if (prevEntry?.previewUrl) {
        URL.revokeObjectURL(prevEntry.previewUrl);
      }

      return {
        ...prev,
        [itemId]: {
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });
  };

  const handleRowDrop = (itemId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingItemId(null);

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    selectFileForItem(itemId, file);
  };

  const parseItemIdFromFilename = (name) => {
    const base = String(name || "")
      .split("/")
      .pop()
      .split("\\")
      .pop();
    const fileBase = String(base || "").replace(/\.[^.]+$/, "");
    const itemId = fileBase.trim();
    if (!/^\d+$/.test(itemId)) return null;
    return itemId;
  };

  const addBulkFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const nextByItemId = new Map();
    // Keep existing selections, but allow new files to override same itemid.
    for (const entry of bulkFiles) {
      if (entry?.itemId) nextByItemId.set(entry.itemId, entry);
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Rejected ${file.name}: only jpg, jpeg, png, webp allowed`);
        continue;
      }

      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`Rejected ${file.name}: must be smaller than 300KB`);
        continue;
      }

      const itemId = parseItemIdFromFilename(file.name);
      if (!itemId) {
        toast.error(
          `Rejected ${file.name}: filename must be the dish itemid (e.g., 10537737.jpg)`,
        );
        continue;
      }

      const prev = nextByItemId.get(itemId);
      if (prev?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }

      nextByItemId.set(itemId, {
        itemId,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setBulkFiles(Array.from(nextByItemId.values()));
  };

  const handleBulkInputChange = (event) => {
    addBulkFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    addBulkFiles(event.dataTransfer.files);
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      toast.error("Select images first");
      return;
    }

    try {
      setBulkUploading(true);
      const formData = new FormData();
      for (const entry of bulkFiles) {
        formData.append("images", entry.file);
      }

      const res = await apiRequest("/admin/upload-dish-images", {
        method: "POST",
        body: formData,
      });

      const uploaded = Array.isArray(res.uploaded) ? res.uploaded : [];
      toast.success(`Uploaded ${uploaded.length} image(s)`);

      // Update local items immediately.
      const uploadedById = new Map();
      for (const p of uploaded) {
        const match = String(p || "").match(/\/uploads\/menu\/(\d+)\.webp$/);
        if (match?.[1]) uploadedById.set(match[1], p);
      }

      setItems((prev) =>
        prev.map((it) => {
          const path = uploadedById.get(String(it.id));
          if (!path) return it;
          return {
            ...it,
            custom_image: path,
            image: path,
          };
        }),
      );

      // Cleanup previews.
      bulkFiles.forEach((entry) => {
        if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      });
      setBulkFiles([]);

      await loadMenu();
    } catch (error) {
      toast.error(error.message || "Upload failed");

      if (
        String(error.message || "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        await handleLogout();
      }
    } finally {
      setBulkUploading(false);
    }
  };

  const handleUpload = async (item) => {
    const itemId = item?.id;
    if (!itemId) {
      toast.error("Invalid item");
      return;
    }

    const entry = selected[itemId];
    if (!entry?.file) {
      toast.error("Select an image first");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [itemId]: true }));

      const formData = new FormData();
      formData.append("itemid", itemId);
      formData.append("image", entry.file);

      const res = await apiRequest("/admin/upload-dish-image", {
        method: "POST",
        body: formData,
      });

      const imagePath = res.image;
      toast.success("Dish image uploaded");

      setItems((prev) =>
        prev.map((it) =>
          it.id === itemId
            ? {
                ...it,
                custom_image: imagePath,
                image: imagePath,
              }
            : it,
        ),
      );

      setSelected((prev) => {
        const next = { ...prev };
        if (next[itemId]?.previewUrl) {
          URL.revokeObjectURL(next[itemId].previewUrl);
        }
        delete next[itemId];
        return next;
      });

      // Optional: refresh to reflect backend mapping/caching behavior.
      await loadMenu();
    } catch (error) {
      toast.error(error.message || "Upload failed");

      if (
        String(error.message || "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        await handleLogout();
      }
    } finally {
      setUploading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <AdminSidebar activeItem="dishImages" onLogout={handleLogout} />

        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h1 className="text-2xl font-semibold">Dish Image Manager</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload custom images per dish (stored locally) to avoid Petpooja
                CDN expiry.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold">
                      Upload Multiple Dish Images
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Drag & drop or select multiple files. Filenames must be
                      the dish itemid (e.g., 10537737.jpg). Max 300KB each.
                      Allowed: jpg, jpeg, png, webp.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="secondary">
                      <label className="cursor-pointer">
                        Select Images
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={handleBulkInputChange}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBulkUpload}
                      disabled={bulkUploading || bulkFiles.length === 0}
                    >
                      {bulkUploading
                        ? "Uploading..."
                        : `Upload ${bulkFiles.length || ""}`}
                    </Button>
                  </div>
                </div>

                <div
                  className={`mt-4 rounded-md border border-dashed border-border p-6 text-center text-sm ${
                    isDragging ? "bg-muted" : "bg-background"
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                >
                  <div className="font-medium">
                    Drag & Drop Dish Images Here
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    or use “Click to Upload”
                  </div>
                </div>

                {bulkFiles.length > 0 ? (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">
                      Selected Images
                    </div>
                    <div className="space-y-2">
                      {bulkFiles.map((entry) => (
                        <div
                          key={entry.itemId}
                          className="flex items-center gap-3 rounded-md border border-border p-2"
                        >
                          <img
                            src={entry.previewUrl}
                            alt={entry.itemId}
                            className="h-12 w-12 rounded-md object-cover bg-background border border-border"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {entry.file.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Item ID: {entry.itemId} •{" "}
                              {(entry.file.size / 1024).toFixed(0)}KB
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading dishes...
                </p>
              ) : sortedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No dishes found.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by dish name, category, or item id (e.g., 10537737)"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{loading ? "Loading…" : rangeLabel}</span>
                      <span>•</span>
                      <span>
                        Total {filteredItems.length} / {sortedItems.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground">
                        Page {page} / {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Prev
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={page >= totalPages}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <table className="min-w-[860px] w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 pr-4 font-semibold">
                              Dish Name
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Category
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Current Image
                            </th>
                            <th className="py-2 pr-4 font-semibold">Upload</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageItems.map((item) => {
                            const itemId = item.id;
                            const previewUrl =
                              selected[itemId]?.previewUrl || "";
                            const currentSrc =
                              previewUrl ||
                              getImage(
                                item.custom_image ||
                                  item.item_image_url ||
                                  item.image,
                              );

                            return (
                              <tr
                                key={itemId}
                                className="border-b border-border align-middle"
                              >
                                <td className="py-3 pr-4">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Item ID: {itemId}
                                  </div>
                                </td>
                                <td className="py-3 pr-4 text-muted-foreground">
                                  {item.category || "—"}
                                </td>
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={currentSrc}
                                      alt={item.name}
                                      className="h-14 w-14 rounded-md object-cover border border-border bg-background"
                                      loading="lazy"
                                    />
                                    {previewUrl ? (
                                      <span className="text-xs text-muted-foreground">
                                        Selected preview
                                      </span>
                                    ) : item.custom_image ? (
                                      <span className="text-xs text-muted-foreground">
                                        Custom image
                                      </span>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">
                                        Petpooja/placeholder
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 pr-4">
                                  <div className="space-y-2">
                                    <div
                                      className={`rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground ${
                                        draggingItemId === itemId
                                          ? "bg-muted"
                                          : "bg-background"
                                      }`}
                                      onDragEnter={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDraggingItemId(itemId);
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDraggingItemId(itemId);
                                      }}
                                      onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDraggingItemId((prev) =>
                                          prev === itemId ? null : prev,
                                        );
                                      }}
                                      onDrop={(e) => handleRowDrop(itemId, e)}
                                    >
                                      Drag & drop image for this dish
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                      <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                          handleSelectFile(itemId, e)
                                        }
                                        className="w-full sm:max-w-[320px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleUpload(item)}
                                        disabled={Boolean(uploading[itemId])}
                                        className="whitespace-nowrap"
                                      >
                                        {uploading[itemId]
                                          ? "Uploading..."
                                          : "Upload"}
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Prev
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={page >= totalPages}
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishImageManager;
