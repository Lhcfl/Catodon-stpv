<template>
	<MkA :to="`/gallery/${post.id}`" class="ttasepnz _panel">
		<div class="thumbnail">
			<ImgWithBlurhash
				class="img"
				:src="post.files[0].thumbnailUrl"
				:hash="post.files[0].blurhash"
			/>
		</div>
		<article>
			<header>
				<MkAvatar :user="post.user" class="avatar" />
			</header>
			<footer>
				<span class="title">{{ post.title }}</span>
			</footer>
		</article>
	</MkA>
</template>

<script lang="ts" setup>
import ImgWithBlurhash from "@/components/MkImgWithBlurhash.vue";

const props = defineProps<{
	post: any;
}>();
</script>

<style lang="scss" scoped>
.ttasepnz {
	display: block;
	position: relative;
	height: 200px;

	&:hover,
	&:focus {
		text-decoration: none;
		color: var(--accent);

		> .thumbnail {
			transform: scale(1.1);
		}

		> article {
			> footer {
				&:before {
					opacity: 1;
				}
			}
		}
	}

	> .thumbnail {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		position: absolute;
		transition: all 0.5s ease;

		> .img {
			position: relative;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	> article {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;

		> header {
			position: absolute;
			top: 0;
			width: 100%;
			padding: 12px;
			box-sizing: border-box;
			display: flex;

			> .avatar {
				margin-inline-start: auto;
				width: 32px;
				height: 32px;
			}
		}

		> footer {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 16px;
			box-sizing: border-box;
			color: #fff;
			text-shadow: 0 0 8px var(--shadow);
			background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));

			&:before {
				content: "";
				display: block;
				position: absolute;
				z-index: -1;
				top: 0;
				inset-inline-start: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(0, 0, 0, 0.4), transparent);
				opacity: 0;
				transition: opacity 0.5s ease;
			}

			> .title {
				font-weight: bold;
			}
		}
	}
}
</style>
