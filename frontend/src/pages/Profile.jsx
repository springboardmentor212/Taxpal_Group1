export default function Profile() {
  const user = JSON.parse(localStorage.getItem("taxpal_user") || "{}");

  return (
    <>
      <h2 className="card-title">Profile</h2>

      <div className="card" style={{ maxWidth: 420 }}>
        <p><b>Username:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
    </>
  );
}
