redirectIfNotLoggedIn();

const currentUser = getUser();
const profileCard = document.getElementById("profileCard");
const searchedUser = document.getElementById("searchedUser");

const renderUser = (user, showFollow = false) => {
  const isFollowing = user.followers?.includes(currentUser.id);

  return `
    <h2>${user.username}</h2>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Bio:</strong> ${user.bio || "No bio yet"}</p>
    ${user.profilePicture ? `<img class="profile-image" src="${user.profilePicture}" alt="profile">` : ""}
    <p><strong>Followers:</strong> ${user.followers?.length || 0}</p>
    <p><strong>Following:</strong> ${user.following?.length || 0}</p>
    ${
      showFollow
        ? `<button onclick="followUser('${user._id}')">${isFollowing ? "Unfollow" : "Follow"}</button>`
        : ""
    }
  `;
};

const loadMyProfile = async () => {
  const res = await fetch(`${API_BASE}/users/${currentUser.id}`, {
    headers: authHeaders()
  });
  const user = await res.json();

  if (!res.ok) {
    profileCard.innerHTML = `<p class="message">${user.message || "Profile load failed"}</p>`;
    return;
  }

  profileCard.innerHTML = renderUser(user);
  document.getElementById("bio").value = user.bio || "";
  document.getElementById("profilePicture").value = user.profilePicture || "";
};

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    bio: document.getElementById("bio").value.trim(),
    profilePicture: document.getElementById("profilePicture").value.trim()
  };

  await fetch(`${API_BASE}/users/me/update`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  loadMyProfile();
});

document.getElementById("searchUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("searchUserId").value.trim();

  const res = await fetch(`${API_BASE}/users/${userId}`, {
    headers: authHeaders()
  });
  const user = await res.json();

  if (!res.ok) {
    searchedUser.innerHTML = `<p class="message">${user.message || "User not found"}</p>`;
    return;
  }

  const showFollowBtn = user._id !== currentUser.id;
  searchedUser.innerHTML = renderUser(user, showFollowBtn);
});

const followUser = async (userId) => {
  await fetch(`${API_BASE}/users/${userId}/follow`, {
    method: "PUT",
    headers: authHeaders()
  });

  loadMyProfile();

  // Reload searched user to refresh follow button text
  const searchId = document.getElementById("searchUserId").value.trim();
  if (searchId) {
    document.getElementById("searchUserForm").dispatchEvent(new Event("submit"));
  }
};

window.followUser = followUser;

loadMyProfile();
