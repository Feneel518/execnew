import { FC } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchNumberProps {}

const SearchNumber: FC<SearchNumberProps> = ({}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("queryNumber", term);
      params.delete("query");
    } else {
      params.delete("queryNumber");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Input
        defaultValue={searchParams.get("queryNumber")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`Filter ${pathname.split("/").at(-1)} Numbers ...`}
        className="max-w-sm"
        type="number"
      />
    </div>
  );
};

export default SearchNumber;
