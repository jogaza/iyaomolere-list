interface ListProps {
  userId: string;
}
export default function UrlDisplay({ userId }: ListProps) {
  const webUrl = process.env.APP_LIST_URL;
  return (
    <div className="text-center text-sm text-gray-500 mt-2 mb-4">
      Share this list using: {webUrl}
      {userId}
    </div>
  );
}
