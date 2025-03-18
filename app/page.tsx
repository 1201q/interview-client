export default async function Home() {
  // const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);

  // console.log(await data.json());

  return <div>{process.env.NEXT_PUBLIC_API_URL}</div>;
}
