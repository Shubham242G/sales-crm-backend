"use client"
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "../../common/constant.common";
import { PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const usePagination = (
  getPaginationFromParams = true,
  pageIndexKey: string = pageIndex,
  pageSizeKey: string = pageSize,
) => {
  const [searchParams] = useSearchParams(); // Destructure to get URLSearchParams

  const pagination: PaginationState = useMemo(() => {
    if (getPaginationFromParams === false) {
      return {
        pageIndex: 0,
        pageSize: 10000,
      };
    }

    let index = searchParams.get(pageIndexKey);
    let size = searchParams.get(pageSizeKey);

    return {
      pageIndex: index ? Number(index) : defaultPageIndex,
      pageSize: size ? Number(size) : defaultPageSize,
    };
  }, [searchParams, getPaginationFromParams, pageIndexKey, pageSizeKey]);

  return pagination;
};
