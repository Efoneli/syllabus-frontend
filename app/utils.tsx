
// export const hasPermission = (permission: string) => {
//     const permissions = JSON.parse(localStorage.getItem('permissions'))
//     return permissions.includes(permission)
//         // return true;
//       };
    

export const hasPermission = (permission: string) => {
  const storedPermissions = localStorage.getItem('permissions');
  const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];

  return permissions.includes(permission);
};
