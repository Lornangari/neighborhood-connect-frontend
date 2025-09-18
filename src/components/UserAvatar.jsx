 function UserAvatar({ username }) {
  if (!username) return null;

 
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
  ];
  const colorIndex = username.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded-full ${bgColor} text-white font-bold`}
    >
      {username[0].toUpperCase()}
    </div>
  );
}
export default UserAvatar;
