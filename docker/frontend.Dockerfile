FROM node:20-alpine AS runner

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/app/api-reference/next-config-js/output
COPY public ./public
COPY --chown=nextjs:nodejs /.next/static ./.next/static
COPY --chown=nextjs:nodejs /.next/standalone ./
RUN touch /app.log

# RUN npm install sharp
USER nextjs

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]