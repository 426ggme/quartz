import type { SocialImageOptions } from "../../.quartz/plugins/og-image/dist/index.js"
import type { Theme } from "../util/theme"

function fontName(font: string | { name: string }): string {
  return typeof font === "string" ? font : font.name
}

export const socialImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  userOpts,
  title,
  fileData,
  iconBase64,
}) => {
  const theme = cfg.theme as Theme
  const colors = theme.colors[userOpts.colorScheme]
  const bodyFont = fontName(theme.typography.body)
  const headerFont = fontName(theme.typography.header)
  const description = fileData.frontmatter?.socialDescription ?? fileData.frontmatter?.description

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "72px",
        gap: "64px",
        backgroundColor: colors.light,
        color: colors.dark,
        fontFamily: bodyFont,
      }}
    >
      {iconBase64 && (
        <img
          src={iconBase64}
          alt=""
          width={390}
          height={390}
          style={{
            objectFit: "cover",
            border: `2px solid ${colors.lightgray}`,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: "24px",
            color: colors.gray,
            fontSize: 28,
          }}
        >
          {cfg.baseUrl ?? cfg.pageTitle}
        </div>
        <div
          style={{
            display: "flex",
            color: colors.dark,
            fontFamily: headerFont,
            fontSize: title.length > 30 ? 48 : 58,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              color: colors.darkgray,
              fontSize: 30,
              lineHeight: 1.45,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
