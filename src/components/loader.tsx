import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

import { Clock } from 'three';

export default function Loader() {
    function Board() {
        const boardRef: React.MutableRefObject<any> = useRef();
        let clock = new Clock();
        useFrame(state => {
            let elapsedTime = clock.getElapsedTime();
            if(!boardRef.current) {
                return;
            }
            boardRef.current.rotation.set(Math.PI / 4, Math.sin(elapsedTime / 10) / 4, 0);
        })

        const board = useGLTF('/loader/scene.gltf');
        const animations = useAnimations(board.animations, board.scene);
        useEffect(() => {
            const action = animations.actions.Animation;
            action?.play();
        }, []);

        return <primitive 
            ref={boardRef} 
            rotation={[ Math.PI / 4, 0, 0 ]} 
            position={[0, 2, 0]} 
            object={board.scene} 
            scale={1.4}
        />
    }

    return (
        <Canvas style={{ zIndex: "0", height: '100%', width: "100%", position: "absolute" }}>
            <PerspectiveCamera />
            <ambientLight args={['#a6a6a6', 1]} />
            <spotLight position={[10, 15, 10]} angle={0.3}></spotLight>
            <Board />
        </Canvas>
    );
}