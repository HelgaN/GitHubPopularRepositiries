const itemTemplate = (item) => {
  return `
    <tr class="table-light">
      <td><img class="avatar" src="${item.owner.avatar_url}"></td>
      <td>${item.name}</td>
      <td>${item.owner.login}</td>
      <td>${item.stargazers_count}</td>
      <td>${item.language !== null ? item.language : "content"}</td>
      <td>${item.updated_at.slice(0, 10)} ${item.updated_at.slice(11, -1)}</td>
      <td colspan="2">
        <a class="table-link" href="${item.svn_url}">${item.svn_url}</a>
      </td>
    </tr>
  `;
}

export default itemTemplate;
