export default async function Home() {
  const data = await fetch(`https://api.aiterview.tech/`);
  const res = data;

  console.log(res);

  return <div>1</div>;
}
