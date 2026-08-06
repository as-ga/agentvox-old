"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { resumeService } from "@/features/resume/services/resume.service";
import type {
  UploadProgressState,
  UploadResumePayload,
  UploadResumeResponse,
} from "@/features/resume/types/resume.types";
import { normalizeApiError } from "@/services/api/errors";

const initialProgressState: UploadProgressState = {
  status: "idle",
  progress: 0,
  errorMessage: null,
};

export function useUploadResume() {
  const [progressState, setProgressState] =
    useState<UploadProgressState>(initialProgressState);

  const resetProgress = useCallback(() => {
    setProgressState(initialProgressState);
  }, []);

  const mutation = useMutation<
    UploadResumeResponse,
    unknown,
    UploadResumePayload
  >({
    mutationKey: ["resume", "upload"],
    retry: false,
    mutationFn: async (payload) => {
      setProgressState({
        status: "uploading",
        progress: 0,
        errorMessage: null,
      });

      try {
        const response = await resumeService.uploadResume(payload, {
          onProgress: (progress) => {
            setProgressState((previous) => ({
              ...previous,
              status: "uploading",
              progress,
              errorMessage: null,
            }));
          },
        });

        setProgressState({
          status: "success",
          progress: 100,
          errorMessage: null,
        });

        return response;
      } catch (error) {
        const normalized = normalizeApiError(error);
        setProgressState({
          status: "error",
          progress: 0,
          errorMessage: normalized.message,
        });
        throw error;
      }
    },
  });

  return {
    ...mutation,
    progressState,
    resetProgress,
    isUploading: mutation.isPending || progressState.status === "uploading",
  };
}
