function readPackageHook(pkg) {
  // Allow build scripts for these critical packages
  if (['@prisma/engines', 'prisma', 'esbuild', 'bufferutil'].includes(pkg.name)) {
    pkg.allowBuild = true;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage: readPackageHook,
  },
};
