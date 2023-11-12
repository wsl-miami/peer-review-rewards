# Use the Node.js alpine base image
FROM node:16-alpine as builder

# Extend Heap Space
ENV NODE_OPTIONS=--max_old_space_size=6048

# Copy the code to the image
WORKDIR /app

# Copy repository files
COPY . .

# Install dependencies and build app, add back if another server is created :)
# RUN cd ./review-ui && \
#     npm install && \
#     npm run build


# Use nginx for hosting
FROM nginx:1.21.0-alpine as production

# Create environment
ENV NODE_ENV production

# Copy build from node image
COPY --from=builder /app/review-ui/build /usr/share/nginx/html

# Add nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]