import logo from "@/assets/logo.jpg";

export function Heading() {
  return (
    <>
      <img
        src={logo}
        width={134}
        height={134}
        style={{ margin: "auto", borderRadius: 100 }}
      />
      <h3 className="scroll-m-20 text-4xl font-semibold tracking-tight text-center">
        Cześć,
      </h3>
      <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
        Zaplanuj z nami swoją karierę!
      </h4>
    </>
  );
}
