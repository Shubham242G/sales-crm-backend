"use client"
import { defaultPageIndex, defaultPageSize, pageIndex, pageSize } from "@/common/constant.common";
import { PaginationState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const usePagination = (
  getPaginationFromParams = true,
  pageIndexKey: string = pageIndex,
  pageSizeKey: string = pageSize,
) => {
  let [searchParams, setSearchParams] = useSearchParams();

  const pagination: PaginationState = useMemo(() => {
    if (getPaginationFromParams === false) {
      return {
        pageIndex: 1,
        pageSize: 10000,
      };
    }
    if(searchParams){

      let index = searchParams.get(pageIndexKey);
      let size = searchParams.get(pageSizeKey);
      return {
        pageIndex: index ? Number(index) : defaultPageIndex,
        pageSize: size ? Number(size) : defaultPageSize,
      };
    }
    else{
      return {
        pageIndex: 1,
        pageSize: 10000,
      };
    }
  }, [searchParams, getPaginationFromParams, pageIndexKey, pageSizeKey]);

  return pagination;
};
