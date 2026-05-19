import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { JOB_API_END_POINT } from "@/components/utils/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, BriefcaseIcon } from "lucide-react";

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AllAdminJobs } = useSelector((store) => store.job);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    experience: "",
    location: "",
    vacancies: "",
    companyId: "",
  });

  // Pre-fill form from Redux store or fetch from API
  useEffect(() => {
    const existingJob = AllAdminJobs?.find((job) => job._id === id);

    if (existingJob) {
      setForm({
        title: existingJob.title || "",
        description: existingJob.description || "",
        requirements: Array.isArray(existingJob.requirements)
          ? existingJob.requirements.join(", ")
          : existingJob.requirements || "",
        salary: existingJob.salary?.toString() || "",
        experience: existingJob.experience || "",
        location: existingJob.location || "",
        vacancies: existingJob.vacancies?.toString() || "",
        companyId:
          existingJob.companyId?._id || existingJob.companyId || "",
      });
      setFetching(false);
    } else {
      // Fallback: fetch from API if not in store
      const fetchJob = async () => {
        try {
          const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            const job = res.data.job;
            setForm({
              title: job.title || "",
              description: job.description || "",
              requirements: Array.isArray(job.requirements)
                ? job.requirements.join(", ")
                : job.requirements || "",
              salary: job.salary?.toString() || "",
              experience: job.experience || "",
              location: job.location || "",
              vacancies: job.vacancies?.toString() || "",
              companyId: job.companyId?._id || job.companyId || "",
            });
          }
        } catch (error) {
          toast.error("Failed to load job details.");
          navigate("/admin/jobs");
        } finally {
          setFetching(false);
        }
      };
      fetchJob();
    }
  }, [id, AllAdminJobs, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        form,
        { withCredentials: true }
      );
       
      if (res.data.success) {
        toast.success(res.data.message || "Job updated successfully!");
        navigate("/admin/jobs");
      }
       
     
    } catch (error) {
            const err = error?.response?.data;
            if (err?.errors?.length > 0) {
              // only show first error message for simplicity
              toast.error(err.errors[0].message);
            } else {
                toast.error(err?.message || 'Something went wrong');
            }}  finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <p className="text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Jobs
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Job</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Edit the fields below and save changes
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-6"
      >
        {/* Row 1: Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Job Title <span className="text-red-400">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            required
            className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100"
          />
        </div>

        {/* Row 2: Description */}
        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and expectations..."
            required
            rows={5}
            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100 resize-none"
          />
        </div>

        {/* Row 3: Requirements */}
        <div className="space-y-1.5">
          <Label
            htmlFor="requirements"
            className="text-sm font-medium text-gray-700"
          >
            Requirements{" "}
            <span className="text-gray-400 font-normal text-xs">
              (comma separated)
            </span>{" "}
            <span className="text-red-400">*</span>
          </Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB, REST APIs"
            required
            rows={3}
            className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100 resize-none"
          />
          <p className="text-xs text-gray-400">
            Separate each skill or requirement with a comma
          </p>
        </div>

        {/* Row 4: Salary & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="salary"
              className="text-sm font-medium text-gray-700"
            >
              Salary (PKR / month) <span className="text-red-400">*</span>
            </Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              min={0}
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 150000"
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="experience"
              className="text-sm font-medium text-gray-700"
            >
              Experience Level <span className="text-red-400">*</span>
            </Label>
            <Select
              value={form.experience}
              onValueChange={(val) => handleSelectChange("experience", val)}
              required
            >
              <SelectTrigger className="h-11 rounded-xl border-gray-200">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fresher">Fresher (0 years)</SelectItem>
                <SelectItem value="1-2 years">1–2 years</SelectItem>
                <SelectItem value="2-3 years">2–3 years</SelectItem>
                <SelectItem value="3-5 years">3–5 years</SelectItem>
                <SelectItem value="5+ years">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 5: Location & Vacancies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-gray-700"
            >
              Location <span className="text-red-400">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Karachi, Remote"
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="vacancies"
              className="text-sm font-medium text-gray-700"
            >
              Vacancies <span className="text-red-400">*</span>
            </Label>
            <Input
              id="vacancies"
              name="vacancies"
              type="number"
              min={1}
              value={form.vacancies}
              onChange={handleChange}
              placeholder="e.g. 3"
              required
              className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Row 6: Company ID (hidden / readonly) */}
        <div className="space-y-1.5">
          <Label
            htmlFor="companyId"
            className="text-sm font-medium text-gray-700"
          >
            Company ID{" "}
            <span className="text-gray-400 font-normal text-xs">
              (auto-filled)
            </span>
          </Label>
          <Input
            id="companyId"
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            readOnly
            className="h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-2" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-xl px-6 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobEdit;