use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let protoc = protoc_bin_vendored::protoc_bin_path()?;
    std::env::set_var("PROTOC", protoc);

    let root = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR")?);
    let proto_dir = root.parent().expect("shield lives inside the repo").join("proto");
    let proto = proto_dir.join("shield.proto");

    println!("cargo:rerun-if-changed={}", proto.display());

    tonic_build::configure()
        .build_client(false)
        .build_server(true)
        .compile_protos(&[proto], &[proto_dir])?;

    Ok(())
}
