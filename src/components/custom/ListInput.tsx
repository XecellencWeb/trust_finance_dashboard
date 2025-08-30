import React, {
  ChangeEvent,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { CardContent } from "../trackers-components";
import { cn } from "@/lib/utils";

interface ListInputProps<T = any>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  onItemSelect: (value: T) => void;
  onTextChange: (value: string) => void;
}

interface ListOptionProps<T = any> {
  children: ReactNode;
  value: T;
  onSelect?: (value: T) => void;
  className?: string;
}

interface ListInputContextProps {
  setSelectedListItemText: (text: string) => void;
}

const ListInputContext = createContext<ListInputContextProps>({
  setSelectedListItemText: (text) => {},
});

const useListInputContext = () => useContext(ListInputContext);

const ListInput = <T,>({
  children,
  className,
  onItemSelect,
  onTextChange,
  ...Props
}: ListInputProps<T>) => {
  const [showChildren, setShowChildren] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectItem = (value: T) => {
    onItemSelect?.(value);
    setShowChildren(false); // Hide dropdown
  };

  const mappedChildren = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, {
          //@ts-ignore
          onSelect: handleSelectItem,
        })
      : null
  );

  const hasValidChildren = mappedChildren?.some(Boolean);

  // ✅ Hide when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowChildren(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ListInputContext.Provider
      value={{ setSelectedListItemText: onTextChange }}
    >
      <div className="relative" ref={containerRef}>
        <Input
          onFocus={() => setShowChildren(true)}
          value={Props.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onTextChange(e.target.value);
          }}
        />

        <Card
          className={cn(
            "absolute top-full mt-2 left-0 w-full z-50 max-h-56 overflow-scroll transition-200",
            showChildren && hasValidChildren
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
        >
          <CardContent>{mappedChildren}</CardContent>
        </Card>
      </div>
    </ListInputContext.Provider>
  );
};

const ListOption = <T = any,>({
  children,
  value,
  onSelect,
}: ListOptionProps<T>) => {
  const { setSelectedListItemText } = useListInputContext();

  const handleClick = () => {
    if (typeof children === "string") setSelectedListItemText(children);

    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-2 hover:bg-gray-100 rounded"
    >
      {typeof children === "string" ? children : "List Option must be a string"}
    </div>
  );
};

// Export all components
export default ListInput;
export { ListOption };
