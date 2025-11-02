import {
  createContext,
  useContext,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

interface ITabContext {
  openPanelId: string;
  open: (panelId: string) => void;
}
const TabsContext = createContext<ITabContext | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "useTabContext can not be used outside the Tabs Context provider",
    );
  }
  return context;
}

function TabsContextProvider({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue: string;
}) {
  const [selectedPanelId, setSelectedPanelId] = useState(defaultValue);

  const value = {
    open: (panelId) => setSelectedPanelId(panelId),
    openPanelId: selectedPanelId,
  } satisfies ITabContext;

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

interface RootProps {
  defaultValue: string;
  children: ReactNode;
}
function Root({ defaultValue, children }: RootProps) {
  return (
    <TabsContextProvider defaultValue={defaultValue}>
      {children}
    </TabsContextProvider>
  );
}

interface ListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "aria-label"> {
  children: ReactNode;
  ariaLabel: string;
}
function List({ children, ariaLabel, ...restProps }: ListProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(e: KeyboardEvent) {
    if (!tabListRef.current) return;
    const tabList = tabListRef.current;
    const tabs = Array.from<HTMLButtonElement>(
      tabList.querySelectorAll("button[role='tab']:not(:disabled)"),
    );
    const activetabIndex = tabs.findIndex(
      (tab) => tab === document.activeElement,
    );
    if (activetabIndex >= 0) {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowLeft": {
          const prevTabIndex =
            activetabIndex === 0 ? tabs.length - 1 : activetabIndex - 1;
          tabs[prevTabIndex].focus();
          break;
        }
        case "ArrowDown":
        case "ArrowRight": {
          const nextTabIndex =
            activetabIndex === tabs.length - 1 ? 0 : activetabIndex + 1;
          tabs[nextTabIndex].focus();
          break;
        }
        default:
          break;
      }
    }
  }

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      {children}
    </div>
  );
}

interface TabProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "role" | "tabIndex" | "aria-controls" | "aria-selected" | "id"
  > {
  children: ReactNode;
  value: string;
}
function Tab({ children, value, onClick, ...restProps }: TabProps) {
  const { open, openPanelId } = useTabsContext();

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (openPanelId !== value) {
      open(value);
    }
    onClick?.(e);
  }

  return (
    <button
      role="tab"
      tabIndex={openPanelId === value ? 0 : -1}
      aria-selected={openPanelId === value}
      aria-controls={`panel-${value}`}
      id={value}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </button>
  );
}

interface PanelProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "aria-labelledby" | "role"
  > {
  children: ReactNode;
  panelId: string;
}
function Panel({ children, panelId, ...restProps }: PanelProps) {
  const { openPanelId } = useTabsContext();

  if (openPanelId !== panelId) return null;

  return (
    <div
      tabIndex={0}
      role="tabpanel"
      aria-labelledby={`panel-${panelId}`}
      {...restProps}
    >
      {children}
    </div>
  );
}

const Tabs = Object.freeze({
  Root,
  List,
  Tab,
  Panel,
});

export default Tabs;
