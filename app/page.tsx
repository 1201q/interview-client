import Test from "@/components/Test";

export default async function Home() {
  const data = await fetch(`https://api.aiterview.tech/`);
  const res = data.text();

  return (
    <div>
      <Test test={res} />
    </div>
  );
}
