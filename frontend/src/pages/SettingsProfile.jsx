export default function SettingsProfile() {
  // Later this can be fetched from backend
  const user = {
    username: "TaxPal User",
    email: "user@example.com",
  };

  return (
    <>
      <h2 className="card-title">Profile</h2>

      <div className="profile-box">
        <label>Username</label>
        <input className="input" value={user.username} disabled />

        <label>Email</label>
        <input className="input" value={user.email} disabled />
      </div>
    </>
  );
}
