import Tabs from ".";
import styles from "./Tabs.module.css";

export default function TabDemo() {
  return (
    <div className={styles["tabs-container"]}>
      <Tabs.Root defaultValue="tab1">
        <Tabs.List className={styles["tab-list"]} ariaLabel="Tabs Demo">
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>
        <div className={styles["tab-panel"]}>
          <Tabs.Panel panelId="tab1">Tab panel 1</Tabs.Panel>
          <Tabs.Panel panelId="tab2">Tab panel 2</Tabs.Panel>
          <Tabs.Panel panelId="tab3">Tab panel 3</Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  );
}
