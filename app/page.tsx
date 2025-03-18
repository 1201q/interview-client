export default async function Home() {
  const data = await fetch(`https://api.aiterview.tech/`);
  const res = data;
  console.log(res);

  return <div>{process.env.NEXT_PUBLIC_API_URL}</div>;
}
