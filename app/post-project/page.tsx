"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { MARKETPLACE_CATEGORIES } from "../../lib/us-marketplace-taxonomy";
import {
  PROJECT_DRAFT_STORAGE_KEY,
  createEmptyProjectDraft,
  hasMeaningfulProjectDraft,
  readProjectDraft,
  writeProjectDraft,
} from "../../lib/project-draft";
import {
  ArrowRight,
  ImageIcon,
  Lock,
  Plus,
  Save,
} from "lucide-react";

const categories = MARKETPLACE_CATEGORIES.map((category) => ({ ...category, label: category.name }));

type FilePreview = {
  id: string;
  url: string;
  name: string;
  isPdf: boolean;
};

export default function PostProjectPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(
    () => createEmptyProjectDraft().step1.selectedCategory,
  );
  const [projectTitle, setProjectTitle] = useState(
    () => createEmptyProjectDraft().step1.projectTitle,
  );
  const [description, setDescription] = useState(
    () => createEmptyProjectDraft().step1.description,
  );
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [errors, setErrors] = useState({
    selectedCategory: "",
    projectTitle: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const resetForm = useCallback(() => {
    const empty = createEmptyProjectDraft();
    setSelectedCategory(empty.step1.selectedCategory);
    setProjectTitle(empty.step1.projectTitle);
    setDescription(empty.step1.description);
    setPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url));
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors({ selectedCategory: "", projectTitle: "", description: "" });
    setMessage(null);
    setHasDraft(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadDraft = () => {
      const isNewProject = new URLSearchParams(window.location.search).get("new") === "1";
      if (isNewProject) {
        window.localStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY);
        resetForm();
        router.replace("/post-project");
        return;
      }

      const draft = readProjectDraft();
      if (!hasMeaningfulProjectDraft(draft)) {
        resetForm();
        return;
      }
      setHasDraft(true);
      setSelectedCategory(draft!.step1.selectedCategory);
      setProjectTitle(draft!.step1.projectTitle);
      setDescription(draft!.step1.description);
      if (draft!.categoryMigrationRequired) {
        setMessage("Your saved category is no longer available. Please choose one of the four current categories.");
      }
    };

    loadDraft();
  }, [resetForm, router]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  const handleFileChange = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const newFiles = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      url: URL.createObjectURL(file),
      name: file.name,
      isPdf: file.type === "application/pdf",
    }));

    setPreviews((current) => [...current, ...newFiles]);
  };

  const handleSaveDraft = () => {
    if (typeof window === "undefined") {
      return;
    }

    writeProjectDraft({
      categoryMigrationRequired: false,
      step1: {
        selectedCategory,
        projectTitle,
        description,
        referenceImages: previews.map(({ name, isPdf }) => ({ name, isPdf })),
      },
    });

    setHasDraft(true);
    setMessage("Draft saved locally.");
  };

  const handleNextStep = () => {
    const nextErrors = {
      selectedCategory: selectedCategory ? "" : "Select a product category.",
      projectTitle: projectTitle.trim() ? "" : "Enter a project title.",
      description: description.trim() ? "" : "Enter a product description.",
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setMessage("Please complete the required fields before continuing.");
      window.setTimeout(() => {
        const first = nextErrors.selectedCategory ? categoryRef.current : nextErrors.projectTitle ? titleRef.current : descriptionRef.current;
        first?.scrollIntoView({ behavior: "smooth", block: "center" });
        first?.focus();
      }, 0);
      return;
    }

    writeProjectDraft({
      categoryMigrationRequired: false,
      step1: {
        selectedCategory,
        projectTitle,
        description,
        referenceImages: previews.map(({ name, isPdf }) => ({ name, isPdf })),
      },
    });
    setHasDraft(true);
    router.push("/post-project/details");
  };

  const clearDraft = () => {
    window.localStorage.removeItem(PROJECT_DRAFT_STORAGE_KEY);
    resetForm();
    setShowClearConfirmation(false);
    setMessage("Draft cleared.");
  };

  const categoryCards = useMemo(
    () =>
      categories.map((category) => {
        const isSelected = category.id === selectedCategory;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => { setSelectedCategory(category.id); setErrors((current) => ({ ...current, selectedCategory: "" })); }}
            className={`group p-5 rounded-2xl text-left relative transition-all ${
              isSelected
                ? "border-2 border-[#7C8A6A] bg-[#EEF1E8] shadow-md"
                : "border border-[#E5E0D8] bg-[#F6F3EE]/50 hover:border-[#7C8A6A] hover:bg-white hover:shadow-lg"
            }`}
          >
            <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 border border-[#E5E0D8] bg-white">
              <Image
                src={category.image}
                alt={category.alt}
                width={320}
                height={320}
                className={`w-full h-full object-cover ${
                  isSelected ? "" : "group-hover:scale-110"
                } transition-transform duration-500`}
              />
            </div>
            <span
              className={`text-sm font-bold block ${
                isSelected
                  ? "text-[#7C8A6A]"
                  : "text-[#111111] group-hover:text-[#7C8A6A]"
              }`}
            >
              {category.label}
            </span>
            {isSelected ? (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#7C8A6A] rounded-full flex items-center justify-center text-white shadow-sm">
                <span className="text-[10px]">✓</span>
              </div>
            ) : null}
          </button>
        );
      }),
    [selectedCategory],
  );

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header />
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <div className="mb-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[900px] py-4 bg-white rounded-2xl px-10 border border-[#E5E0D8] shadow-sm">
            <div className="flex items-center space-x-3 text-[#111111]">
              <span className="step-num w-8 h-8 rounded-full border border-[#E5E0D8] flex items-center justify-center text-xs font-bold bg-[#7C8A6A] text-white">
                1
              </span>
              <span className="text-sm font-bold tracking-tight">
                Product Category
              </span>
            </div>
            <div className="h-[1px] flex-grow mx-6 bg-[#E5E0D8]"></div>
            <div className="flex items-center space-x-3 text-[#7C7A74]/60">
              <span className="step-num w-8 h-8 rounded-full border border-[#E5E0D8] flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="text-sm font-medium tracking-tight">
                Technical Details
              </span>
            </div>
            <div className="h-[1px] flex-grow mx-6 bg-[#E5E0D8]"></div>
            <div className="flex items-center space-x-3 text-[#7C7A74]/60">
              <span className="step-num w-8 h-8 rounded-full border border-[#E5E0D8] flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="text-sm font-medium tracking-tight">
                Quantity & Budget
              </span>
            </div>
            <div className="h-[1px] flex-grow mx-6 bg-[#E5E0D8]"></div>
            <div className="flex items-center space-x-3 text-[#7C7A74]/60">
              <span className="step-num w-8 h-8 rounded-full border border-[#E5E0D8] flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span className="text-sm font-medium tracking-tight">
                Timeline
              </span>
            </div>
            <div className="h-[1px] flex-grow mx-6 bg-[#E5E0D8]"></div>
            <div className="flex items-center space-x-3 text-[#7C7A74]/60">
              <span className="step-num w-8 h-8 rounded-full border border-[#E5E0D8] flex items-center justify-center text-xs font-bold">
                5
              </span>
              <span className="text-sm font-medium tracking-tight">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-12">
            <div className="bg-white rounded-[2rem] p-12 border border-[#E5E0D8] shadow-sm">
              <header className="mb-12">
                <h1 className="text-4xl font-bold text-[#111111] mb-4 tracking-tight">
                  Tell us what you want to make
                </h1>
                <p className="text-lg text-[#7C7A74] max-w-2xl leading-relaxed">
                  Start with the product category and a short description. You
                  can refine the specific details and materials in the next
                  steps.
                </p>
              </header>

              <div className="mb-14">
                <div className="flex items-center justify-between mb-8">
                  <label className="text-sm font-bold uppercase tracking-widest text-[#1F2937]">
                    Select Category
                  </label>
                  <span className="text-xs font-bold text-[#7C8A6A] bg-[#EEF1E8] px-3 py-1 rounded-full">
                    Required
                  </span>
                </div>
                <div ref={categoryRef} tabIndex={-1} aria-invalid={Boolean(errors.selectedCategory)} aria-describedby={errors.selectedCategory ? "category-error" : undefined} className={`grid grid-cols-2 sm:grid-cols-4 gap-5 rounded-2xl outline-none ${errors.selectedCategory ? "ring-2 ring-[#C9826B]/40" : ""}`}>
                  {categoryCards}
                </div>
                {errors.selectedCategory ? <p id="category-error" className="mt-3 text-sm text-[#C9826B]">{errors.selectedCategory}</p> : null}
              </div>

              <div className="mb-12">
                <label
                  htmlFor="project-title"
                  className="block text-sm font-bold uppercase tracking-widest text-[#1F2937] mb-4"
                >
                  Project Title · Required
                </label>
                <input
                  id="project-title"
                  ref={titleRef}
                  type="text"
                  value={projectTitle}
                  onBlur={() => { if (!projectTitle.trim()) setErrors((current) => ({ ...current, projectTitle: "Enter a project title." })); }}
                  onChange={(event) => { setProjectTitle(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, projectTitle: "" })); }}
                  placeholder="e.g. 250 Luxury Face Serum Bottles with Gold Foil Print"
                  aria-invalid={Boolean(errors.projectTitle)} aria-describedby={errors.projectTitle ? "project-title-error" : undefined}
                  className={`w-full px-6 py-5 rounded-2xl border bg-[#F6F3EE]/60 focus:outline-none focus:ring-4 transition-all text-[#111111] font-medium text-lg placeholder:text-[#7C7A74]/50 ${errors.projectTitle ? "border-[#C9826B] bg-[#F5E6E0]/30 focus:ring-[#C9826B]/10" : "border-[#E5E0D8] focus:border-[#7C8A6A] focus:ring-[#7C8A6A]/10"}`}
                />
                <p className="mt-3 text-sm text-[#7C7A74]">
                  Keep it specific so makers can quickly understand your project
                  scope.
                </p>
                {errors.projectTitle ? (
                  <p id="project-title-error" className="mt-2 text-sm text-[#C9826B]">
                    {errors.projectTitle}
                  </p>
                ) : null}
              </div>

              <div className="mb-12">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold uppercase tracking-widest text-[#1F2937] mb-4"
                >
                  Product Description · Required
                </label>
                <textarea
                  id="description"
                  ref={descriptionRef}
                  rows={6}
                  value={description}
                  onBlur={() => { if (!description.trim()) setErrors((current) => ({ ...current, description: "Enter a product description." })); }}
                  onChange={(event) => { setDescription(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, description: "" })); }}
                  placeholder="Describe your product idea, intended use, and any preliminary thoughts on materials or aesthetic."
                  aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined}
                  className={`w-full px-6 py-5 rounded-2xl border bg-[#F6F3EE]/60 focus:outline-none focus:ring-4 transition-all text-[#111111] leading-relaxed text-lg placeholder:text-[#7C7A74]/50 ${errors.description ? "border-[#C9826B] bg-[#F5E6E0]/30 focus:ring-[#C9826B]/10" : "border-[#E5E0D8] focus:border-[#7C8A6A] focus:ring-[#7C8A6A]/10"}`}
                />
                {errors.description ? (
                  <p id="description-error" className="mt-2 text-sm text-[#C9826B]">
                    {errors.description}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-widest text-[#1F2937] mb-6">
                  Reference Images & Moodboard
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-[#E5E0D8] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#7C8A6A] hover:bg-[#EEF1E8]/50 hover:shadow-inner transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F6F3EE] flex items-center justify-center text-[#7C8A6A] transition-all mb-3">
                      <Plus size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-[#7C7A74] group-hover:text-[#7C8A6A] uppercase tracking-wider">
                      Add Image
                    </span>
                  </button>
                  {previews.length > 0
                    ? previews.map((preview) => (
                        <div
                          key={preview.id}
                          className="aspect-square border border-[#E5E0D8] bg-[#F6F3EE]/50 rounded-2xl flex items-center justify-center overflow-hidden relative"
                        >
                          {preview.isPdf ? (
                            <div className="flex flex-col items-center justify-center text-[#7C7A74] px-4 text-center">
                              <Lock size={24} className="mb-2" />
                              <span className="text-xs font-semibold">PDF</span>
                              <p className="mt-2 text-[11px] leading-snug">
                                {preview.name}
                              </p>
                            </div>
                          ) : (
                            <Image
                              src={preview.url}
                              alt={preview.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))
                    : [1, 2].map((item) => (
                        <div
                          key={item}
                          className="aspect-square border border-[#E5E0D8] bg-[#F6F3EE]/50 rounded-2xl flex flex-col items-center justify-center opacity-40"
                        >
                          <ImageIcon
                            size={24}
                            className="text-[#7C7A74] mb-2"
                          />
                        </div>
                      ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(event) => handleFileChange(event.target.files)}
                />
                <p className="mt-6 text-sm text-[#7C7A74] leading-relaxed">
                  Upload sketches, inspiration, or similar products. Supported
                  formats: JPG, PNG, PDF (Max 10MB each).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-6">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-8 py-4 rounded-full border border-[#E5E0D8] text-[#7C7A74] hover:text-[#111111] hover:border-[#111111] font-bold text-sm uppercase tracking-widest transition-all inline-flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save as draft
                </button>
                {hasDraft ? (
                  <button type="button" onClick={() => setShowClearConfirmation(true)} className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#7C7A74] underline decoration-[#7C8A6A]/30 underline-offset-4 transition-colors hover:text-[#111111]">
                    Clear draft
                  </button>
                ) : null}
              </div>
              <div className="flex items-center space-x-6">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#7C8A6A] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#667255] shadow-xl shadow-[#7C8A6A]/10 transition-all flex items-center"
                >
                  Next Step
                  <ArrowRight size={18} className="ml-3" />
                </button>
              </div>
            </div>
            {message ? (
              <div role="status" className="rounded-2xl border border-[#7C8A6A] bg-[#EEF1E8] px-6 py-4 text-sm text-[#1F2937]">
                {message}
              </div>
            ) : null}
          </div>

          <aside className="space-y-8">
            <div className="bg-white rounded-3xl p-10 border border-[#E5E0D8] shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#7C8A6A]/10" />
              <h3 className="text-xl font-bold text-[#111111] mb-8">
                Guided Production
              </h3>
              <ul className="space-y-8">
                <li className="flex items-start space-x-5">
                  <div className="w-8 h-8 rounded-full bg-[#EEF1E8] text-[#7C8A6A] flex-shrink-0 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-1">
                      Product Foundation
                    </h4>
                    <p className="text-xs text-[#7C7A74] leading-relaxed">
                      Establish the core category and high-level vision for your
                      batch.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-5 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-[#F6F3EE] text-[#7C7A74] flex-shrink-0 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-1">
                      Technical Specs
                    </h4>
                    <p className="text-xs text-[#7C7A74] leading-relaxed">
                      Define materials, dimensions, and specific customization
                      needs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-5 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-[#F6F3EE] text-[#7C7A74] flex-shrink-0 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111111] text-sm mb-1">
                      Volume & Logistics
                    </h4>
                    <p className="text-xs text-[#7C7A74] leading-relaxed">
                      Finalize quantities and delivery timelines for your
                      production brief.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-[#E5E0D8] shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#EEF1E8] flex items-center justify-center text-[#7C8A6A]">
                  <Save size={18} />
                </div>
                <h4 className="font-bold text-[#111111] text-sm">
                  Prototype draft
                </h4>
              </div>
              <p className="text-xs text-[#7C7A74] leading-relaxed mb-6">
                This prototype saves your project draft locally on this device.
                It is not sent to manufacturers while the submission workflow
                is still being connected.
              </p>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-[#7C8A6A] uppercase tracking-widest">
                <Save size={12} />
                <span>Stored locally on this device</span>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#F6F3EE]/30 border border-[#E5E0D8] text-center">
              <p className="text-sm font-medium text-[#7C7A74] mb-4">
                Want to explore potential production partners?
              </p>
              <Link href="/find-makers" className="text-xs font-bold text-[#111111] hover:text-[#7C8A6A] transition-colors underline decoration-[#7C8A6A]/30 underline-offset-4 uppercase tracking-widest">
                Browse makers
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {showClearConfirmation ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#111111]/40 px-4 pt-20 backdrop-blur-sm" onClick={() => setShowClearConfirmation(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="clear-draft-title" className="w-full max-w-lg rounded-[32px] border border-[#E5E0D8] bg-[#F6F3EE] p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Saved project</p>
            <h2 id="clear-draft-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#111111]">Clear saved draft?</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#7C7A74]">Your current saved draft will be removed.</p>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowClearConfirmation(false)} className="rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8]">Cancel</button>
              <button type="button" onClick={clearDraft} className="rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255]">Clear draft</button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className="py-16 border-t border-[#E5E0D8] px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] uppercase tracking-[0.2em] font-bold text-[#7C7A74]/60 space-y-6 md:space-y-0">
          <p>© {new Date().getFullYear()} BatchNGo Marketplace</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/support"
              className="hover:text-[#111111] transition-colors"
            >
              Support Center
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#111111] transition-colors"
            >
              Privacy & Data
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#111111] transition-colors"
            >
              Manufacturer Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
