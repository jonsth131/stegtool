await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './web/js',
    minify: true,
})
