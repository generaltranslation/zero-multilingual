import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from 'react-router';
import { ClientProviders } from '@/providers/client-providers';
import { ServerProviders } from '@/providers/server-providers';
import { useEffect, type PropsWithChildren } from 'react';
import { getServerTrpc } from '@/lib/trpc.server';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';
import { resolveLocale } from '@/i18n/request';
import { getMessages } from '@/i18n/request';
import { signOut } from '@/lib/auth-client';
import type { Route } from './+types/root';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { ArrowLeft } from 'lucide-react';
import { GTProvider, T, Var } from 'gt-react';
import loadTranslations from './loadTranslations';
import config from '../gt.config.json';
import './globals.css';

export const meta: MetaFunction = () => {
	return [
		{ title: siteConfig.title },
		{ name: "description", content: siteConfig.description },
		{ property: "og:title", content: siteConfig.title },
		{ property: "og:description", content: siteConfig.description },
		{ property: "og:image", content: siteConfig.openGraph.images[0].url },
		{ property: "og:url", content: siteConfig.alternates.canonical },
		{ rel: "manifest", href: "/manifest.webmanifest" },
	];
};

export async function loader({ request }: Route.LoaderArgs) {
	const locale = resolveLocale(request);
	const trpc = getServerTrpc(request);

	const connectionId = await trpc.connections.getDefault
		.query()
		.then((res) => res?.id)
		.catch(() => null);

	return {
		locale,
		messages: await getMessages(locale),
		connectionId,
	};
}

export function Layout({ children }: PropsWithChildren) {
	const { locale, messages, connectionId } = useLoaderData<typeof loader>();
	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				{import.meta.env.REACT_SCAN && (
					<script
						crossOrigin="anonymous"
						src="//unpkg.com/react-scan/dist/auto.global.js"
					/>
				)}
				<Links />
			</head>
			<body className="antialiased">
				<ServerProviders
					messages={messages}
					locale={locale}
					connectionId={connectionId}
				>
						<ClientProviders>
              <GTProvider loadTranslations={loadTranslations} config={config}>
                {children}
                </GTProvider>
              </ClientProviders>
				</ServerProviders>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
		if (error.status === 404) {
			return <NotFound />;
		}
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

  useEffect(() => {
    console.error(error);
    console.error({ message, details, stack });
  }, [error, message, details, stack]);

	return (
		<T id="root.0">
			<div className="dark:bg-background flex w-full items-center justify-center bg-white text-center">
				<div className="flex-col items-center justify-center md:flex dark:text-gray-100">
					{/* Message */}
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold tracking-tight">
							Something went wrong!
						</h2>
						<p className="text-muted-foreground">
							See the console for more information.
						</p>
						<pre className="text-muted-foreground">
							<Var>{JSON.stringify(error, null, 2)}</Var>
						</pre>
					</div>

					<div className="mt-2 flex gap-2">
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
							className="text-muted-foreground gap-2"
						>
							Refresh
						</Button>
						<Button
							variant="outline"
							onClick={async () => {
								await signOut();
								window.location.href = "/login";
							}}
							className="text-muted-foreground gap-2"
						>
							Log Out and Refresh
						</Button>
					</div>
				</div>
			</div>
		</T>
	);
}

function NotFound() {
	const navigate = useNavigate();
	const t = useTranslations();

	return (
		<T id="root.1">
			<div className="dark:bg-background flex w-full items-center justify-center bg-white text-center">
				<div className="flex-col items-center justify-center md:flex dark:text-gray-100">
					<div className="relative">
						<h1 className="text-muted-foreground/20 select-none text-[150px] font-bold">
							404
						</h1>
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<AlertCircle className="text-muted-foreground h-20 w-20" />
						</div>
					</div>

					{/* Message */}
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold tracking-tight">
							<Var>{t("pages.error.notFound.title")}</Var>
						</h2>
						<p className="text-muted-foreground">
							<Var>{t("pages.error.notFound.description")}</Var>
						</p>
					</div>

					{/* Buttons */}
					<div className="mt-2 flex gap-2">
						<Button
							variant="outline"
							onClick={() => navigate(-1)}
							className="text-muted-foreground gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							<Var>{t("pages.error.notFound.goBack")}</Var>
						</Button>
					</div>
				</div>
			</div>
		</T>
	);
}
