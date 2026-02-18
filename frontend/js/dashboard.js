redirectIfNotLoggedIn();

const postsContainer = document.getElementById("postsContainer");
const currentUser = getUser();

const escapeHtml = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const loadPosts = async () => {
  try {
    const res = await fetch(`${API_BASE}/posts`, { headers: authHeaders() });
    const posts = await res.json();

    if (!res.ok) {
      postsContainer.innerHTML = `<p class="message">${posts.message || "Failed to load posts"}</p>`;
      return;
    }

    postsContainer.innerHTML = posts
      .map((post) => {
        const canEdit = post.author?._id === currentUser?.id;
        const hasLiked = post.likes?.includes(currentUser?.id);

        return `
          <article class="card">
            <h3>${escapeHtml(post.author?.username || "Unknown")}</h3>
            <p>${escapeHtml(post.content)}</p>
            ${post.imageUrl ? `<img class="post-image" src="${post.imageUrl}" alt="Post image">` : ""}
            <p class="small">${new Date(post.createdAt).toLocaleString()}</p>

            <div class="post-actions">
              <button onclick="toggleLike('${post._id}')">${hasLiked ? "Unlike" : "Like"} (${post.likes.length})</button>
              ${canEdit ? `<button onclick="editPost('${post._id}', '${escapeHtml(post.content)}', '${post.imageUrl || ""}')">Edit</button>` : ""}
              ${canEdit ? `<button class="danger" onclick="deletePost('${post._id}')">Delete</button>` : ""}
            </div>

            <form class="inline-form" onsubmit="addComment(event, '${post._id}')">
              <input type="text" name="commentText" placeholder="Write a comment" required>
              <button type="submit">Comment</button>
            </form>

            <div>
              ${post.comments
                .map(
                  (c) => `
                    <div class="comment">
                      <strong>${escapeHtml(c.author?.username || "User")}</strong>
                      <p>${escapeHtml(c.text)}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </article>
        `;
      })
      .join("");
  } catch {
    postsContainer.innerHTML = '<p class="message">Server not reachable</p>';
  }
};

document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    content: document.getElementById("postContent").value.trim(),
    imageUrl: document.getElementById("postImageUrl").value.trim()
  };

  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    document.getElementById("postForm").reset();
    loadPosts();
  }
});

const toggleLike = async (postId) => {
  await fetch(`${API_BASE}/posts/${postId}/like`, {
    method: "PUT",
    headers: authHeaders()
  });
  loadPosts();
};

const addComment = async (event, postId) => {
  event.preventDefault();
  const input = event.target.commentText;

  await fetch(`${API_BASE}/posts/${postId}/comment`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text: input.value.trim() })
  });

  input.value = "";
  loadPosts();
};

const editPost = async (postId, oldContent, oldImageUrl) => {
  const content = prompt("Edit content:", oldContent);
  if (content === null) return;
  const imageUrl = prompt("Edit image URL:", oldImageUrl || "");
  if (imageUrl === null) return;

  await fetch(`${API_BASE}/posts/${postId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content, imageUrl })
  });

  loadPosts();
};

const deletePost = async (postId) => {
  const ok = confirm("Delete this post?");
  if (!ok) return;

  await fetch(`${API_BASE}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

  loadPosts();
};

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: authHeaders()
  });
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
});

window.toggleLike = toggleLike;
window.addComment = addComment;
window.editPost = editPost;
window.deletePost = deletePost;

loadPosts();
