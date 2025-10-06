import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, SortAsc } from "lucide-react";

interface TodoFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "all" | "active" | "completed";
  onFilterChange: (status: "all" | "active" | "completed") => void;
  sortBy: "date" | "priority";
  onSortChange: (sort: "date" | "priority") => void;
}

export const TodoFilters = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
}: TodoFiltersProps) => {
  return (
    <Card
      className="p-4 border-border/50 overflow-hidden relative"
      style={{
        background: "var(--gradient-card)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      <div className="flex flex-col md:flex-row gap-4 relative">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <div className="flex gap-3 md:w-auto">
          <div className="flex-1 md:w-[180px]">
            <Select
              value={filterStatus}
              onValueChange={(v: any) => onFilterChange(v)}
            >
              <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 md:w-[180px]">
            <Select value={sortBy} onValueChange={(v: any) => onSortChange(v)}>
              <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Created</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};
