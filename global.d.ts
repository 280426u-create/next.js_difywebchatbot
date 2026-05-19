// types/global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "dify-chatbot": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}