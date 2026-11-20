// Makes the iPhone/iPad app icon: the logo centered on a full-bleed white
// square with no transparency (iOS rounds the corners itself).
//
// Usage (from the project root):
//   swift utils/make-ios-icon.swift store/icon-transparent-512.png \
//     "safari/Due This Week/Shared (App)/Assets.xcassets/AppIcon.appiconset/universal-icon-1024@1x.png"
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 3,
  let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, nil),
  let logo = CGImageSourceCreateImageAtIndex(src, 0, nil)
else {
  print("usage: swift make-ios-icon.swift <logo.png> <out.png>")
  exit(1)
}

let size = 1024
let logoShare = 0.72  // how much of the icon the logo fills
let ctx = CGContext(
  data: nil, width: size, height: size, bitsPerComponent: 8, bytesPerRow: 0,
  space: CGColorSpace(name: CGColorSpace.sRGB)!,
  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
ctx.fill(CGRect(x: 0, y: 0, width: size, height: size))
ctx.interpolationQuality = .high
let side = Double(size) * logoShare
let origin = (Double(size) - side) / 2
ctx.draw(logo, in: CGRect(x: origin, y: origin, width: side, height: side))

let out = ctx.makeImage()!
let dst = CGImageDestinationCreateWithURL(
  URL(fileURLWithPath: args[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dst, out, nil)
guard CGImageDestinationFinalize(dst) else { exit(1) }
print("wrote \(args[2])")
