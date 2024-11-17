import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function SearchBar({ className }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchVal = e.target.search.value;
    setSearchParams({ search: searchVal });
  };

  return (
    <div className={twMerge("", className)}>
      <form onSubmit={handleSubmit}>
        <Input name="search" placeholder="Tìm kiếm nhà trọ" />
      </form>
    </div>
  );
}

export default SearchBar;
