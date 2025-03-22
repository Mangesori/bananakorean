const handleRoleChange = async (userId, newRole) => {
  const result = await updateUserRole(userId, newRole);
  if (result.success) {
    alert('사용자 역할이 성공적으로 변경되었습니다.');
  } else {
    alert('역할 변경 실패: ' + result.error);
  }
};
