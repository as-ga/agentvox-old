"use client";

import { apiClient } from "@/services/api/client";
import type {
  UploadResumePayload,
  UploadResumeResponse,
} from "@/features/resume/types/resume.types";

export interface UploadResumeOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export const resumeService = {
  async uploadResume(
    payload: UploadResumePayload,
    options: UploadResumeOptions = {}
  ): Promise<UploadResumeResponse> {
    const formData = new FormData();
    formData.append("fullName", payload.fullName);
    formData.append("email", payload.email);
    formData.append("targetRole", payload.targetRole);
    formData.append("yearsOfExperience", String(payload.yearsOfExperience));
    formData.append("file", payload.file);

    const { data } = await apiClient.post<UploadResumeResponse>(
      "/resumes/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: options.signal,
        onUploadProgress: (event) => {
          if (!options.onProgress) {
            return;
          }

          if (!event.total || event.total <= 0) {
            options.onProgress(0);
            return;
          }

          const percentage = Math.min(
            100,
            Math.round((event.loaded * 100) / event.total)
          );
          options.onProgress(percentage);
        },
      }
    );

    return data;
  },
};
