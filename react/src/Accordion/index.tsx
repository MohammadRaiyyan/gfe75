import type React from "react";
import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

type IAccordionContext = {
  open: string;
  handleOpen: (value: string) => void;
};

const AccordionContext = createContext<IAccordionContext | undefined>(
  undefined,
);

function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "useAccordionContext must be used inside Accordion Context provider",
    );
  }
  return context;
}

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: string;
  children: ReactNode;
}

function Root({ defaultOpen, children, ...rest }: RootProps) {
  const [open, setOpen] = useState<string>(defaultOpen || "");
  const groupRef = useRef<HTMLDivElement>(null);

  function handleOpen(value: string) {
    setOpen(open === value ? "" : value);
  }

  function handlekeyDown(e: React.KeyboardEvent) {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const buttons = Array.from<HTMLButtonElement>(
      group.querySelectorAll("button[name='accordion-header']:not(:disabled)"),
    );
    const activeButton = buttons.findIndex(
      (button) => button === document.activeElement,
    );
    if (activeButton >= 0) {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft": {
          const prevIndex =
            activeButton === 0 ? buttons.length - 1 : activeButton - 1;
          buttons[prevIndex].focus();
          break;
        }
        case "ArrowDown":
        case "ArrowRight": {
          const nextIndex =
            activeButton === buttons.length - 1 ? 0 : activeButton + 1;
          buttons[nextIndex].focus();
          break;
        }
        default:
          break;
      }
    }
  }

  const value = {
    open,
    handleOpen,
  } satisfies IAccordionContext;

  return (
    <AccordionContext.Provider value={value}>
      <div {...rest} ref={groupRef} onKeyDown={handlekeyDown}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type IItemContext = {
  open: boolean;
  handleOpen: VoidFunction;
  contentId: string;
  controlId: string;
};

const ItemContext = createContext<IItemContext | undefined>(undefined);

function useItemContext() {
  const context = useContext(ItemContext);

  if (!context) {
    throw new Error("useItemContext must be used inside Item Context provider");
  }
  return context;
}
interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}
function Item({ value, children, ...rest }: ItemProps) {
  const { open, handleOpen } = useAccordionContext();
  const contentId = useId();
  const controlId = useId();

  function handleOpenItem() {
    handleOpen(open === value ? "" : value);
  }
  const contextValue = {
    open: open === value,
    handleOpen: handleOpenItem,
    contentId,
    controlId,
  } satisfies IItemContext;
  return (
    <ItemContext.Provider value={contextValue}>
      <div {...rest}>{children}</div>
    </ItemContext.Provider>
  );
}
interface HeaderProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "aria-expanded" | "aria-controls" | "id"
  > {
  children: ReactNode;
}
function Header({ children, ...rest }: HeaderProps) {
  const { handleOpen, open, contentId, controlId } = useItemContext();
  return (
    <button
      {...rest}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={handleOpen}
      id={controlId}
      tabIndex={open ? 0 : -1}
      name="accordion-header"
    >
      {children}
    </button>
  );
}
interface ContentProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "id" | "role" | "aria-labelledby"
  > {
  children: ReactNode;
}
function Content({ children, ...rest }: ContentProps) {
  const { open, contentId, controlId } = useItemContext();
  if (!open) return null;
  return (
    <div
      {...rest}
      id={contentId}
      role="region"
      aria-labelledby={controlId}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

const Accordion = Object.freeze({
  Root,
  Item,
  Header,
  Content,
});

export default Accordion;
