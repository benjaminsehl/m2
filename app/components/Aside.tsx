/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```ts
 * <Aside id="search-aside" heading="SEARCH">`
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header>
          <h3>{heading}</h3>
          <CloseAside />
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      &times;
    </a>
  );
}

/** Desired DX
 *
 * <Drawer>
 *   <Drawer.Header>
 *     <Drawer.Title>
 *       {children}
 *     </Drawer.Title>
 *     <Drawer.Close />
 *   </Drawer.Header>
 *   <Drawer.Main>
 *     {children}
 *   </Drawer.Main>
 *   <Drawer.Footer>
 *     // Sticky to bottom, meant for Cart Summary, etc.
 *     {children}
 *   </Drawer.Footer>
 * </Drawer>
 */

/* Rendered HTML should be as simple as possible, so that it's easy to style…
 * <aside class="drawer">
 *   <header>
 *    <h3>Cart</h3>
 *   <a href="#">Close</a>
 *   </header>
 *   <main>
 *     ...
 *   </main>
 *   <footer>
 *     ...
 *   </footer>
 * </aside>
 */
