import Accordion from ".";

export default function AccordionDemo() {
  return (
    <div>
      <Accordion.Root defaultOpen="acc1">
        <Accordion.Item value="acc1">
          <Accordion.Header>Header 1</Accordion.Header>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="acc2">
          <Accordion.Header disabled> Header 2</Accordion.Header>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="acc3">
          <Accordion.Header> Header 3</Accordion.Header>
          <Accordion.Content>Content 3</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
